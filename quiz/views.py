import random
from django.db.models import Count, Q
from django.shortcuts import render, get_object_or_404, redirect
from .models import Maruza, Savol, Javob
from django.contrib.auth.decorators import login_required
from .forms import SavolForm
from django.contrib.auth.decorators import user_passes_test
from django.contrib import messages

@user_passes_test(lambda u: u.is_staff)
def results_view(request):
    # Har bir foydalanuvchi + maruza bo‘yicha natijalar
    natijalar = (
        Javob.objects
        .values(
            "user__id",
            "user__first_name",
            "user__last_name",
            "savol__maruza__id",      # 🔹 to‘g‘ri yo‘li
            "savol__maruza__nom"      # 🔹 maruza nomi
        )
        .annotate(
            togri=Count("id", filter=Q(is_togri=True)),
            umumiy=Count("id"),
        )
        .order_by("user__id", "savol__maruza__id")
    )

    # Foiz hisoblash
    for n in natijalar:
        n["foiz"] = round(n["togri"] / n["umumiy"] * 100, 1) if n["umumiy"] else 0

    return render(request, "results.html", {"natijalar": natijalar})

@user_passes_test(lambda u: u.is_staff)
def result_detail_view(request, user_id, maruza_id):
    from .models import Javob, Maruza

    maruza = get_object_or_404(Maruza, id=maruza_id)
    javoblar = Javob.objects.filter(user_id=user_id, savol__maruza=maruza).select_related("savol")

    return render(request, "result_detail.html", {
        "maruza": maruza,
        "javoblar": javoblar
    })


@user_passes_test(lambda u: u.is_staff)  # faqat adminlarga ruxsat
def edit_savollar(request, maruza_id):
    maruza = get_object_or_404(Maruza, id=maruza_id)
    savollar = Savol.objects.filter(maruza=maruza)

    if request.method == "POST":
        for savol in savollar:
            savol.matn = request.POST.get(f"matn_{savol.id}", savol.matn)
            savol.variant_a = request.POST.get(f"variant_a_{savol.id}", savol.variant_a)
            savol.variant_b = request.POST.get(f"variant_b_{savol.id}", savol.variant_b)
            savol.variant_c = request.POST.get(f"variant_c_{savol.id}", savol.variant_c)
            savol.variant_d = request.POST.get(f"variant_d_{savol.id}", savol.variant_d)
            savol.togri_javob = request.POST.get(f"togri_{savol.id}", savol.togri_javob)
            savol.save()

        messages.success(request, f"✅ {maruza} uchun testlar yangilandi.")
        return redirect("admin_dashboard")  

    return render(request, "edit_savollar.html", {
        "maruza": maruza,
        "savollar": savollar
    })


@login_required
def amaliy_1_interaktiv_view(request):
    savollar = Savol.objects.filter(mavzu='amaliy_1')
    return render(request, 'amaliy_1_interaktiv.html', {'savollar': savollar})

@login_required
def maruza_test_view(request, maruza_id):
    maruza = get_object_or_404(Maruza, id=maruza_id)
    savollar = list(maruza.savollar.all())

    # Avvalgi javoblar
    oldingi_javoblar = Javob.objects.filter(
        user=request.user, savol__in=savollar
    ).values_list("savol_id", flat=True)
    ishlangan_savollar = set(oldingi_javoblar)

    # Qolgan savollar
    qolgan_savollar = [s for s in savollar if s.id not in ishlangan_savollar]

    if not qolgan_savollar:
        # Agar savol qolmagan bo‘lsa → umumiy natija sahifasiga yo‘naltiramiz
        return redirect('natija', maruza_id=maruza.id)

    # 5 ta random savol tanlash
    tanlangan_savollar = random.sample(qolgan_savollar, min(5, len(qolgan_savollar)))

    if request.method == 'POST':
        for savol in tanlangan_savollar:
            tanlangan = request.POST.get(f"savol_{savol.id}")
            if tanlangan:
                obj, _ = Javob.objects.update_or_create(
                    user=request.user,
                    savol=savol,
                    defaults={'tanlangan_javob': tanlangan}
                )
                obj.save()

        return redirect('natija', maruza_id=maruza.id)

    return render(request, 'test.html', {
        'maruza': maruza,
        'savollar': tanlangan_savollar
    })


@login_required
def natija_view(request, maruza_id):
    maruza = get_object_or_404(Maruza, id=maruza_id)
    savollar = list(maruza.savollar.all())
    javoblar = Javob.objects.filter(user=request.user, savol__in=savollar)

    tugri_soni = javoblar.filter(is_togri=True).count()
    umumiy = javoblar.count()
    foiz = round(tugri_soni / umumiy * 100, 1) if umumiy else 0

    # Holatlarni tekshirish
    if umumiy < len(savollar):  # Hali barcha savollar ishlanmagan
        if umumiy == 5 and tugri_soni >= 4:
            xabar = "✅ Tabriklaymiz! Siz mavzuni o‘zlashtirdingiz."
        elif umumiy == 5 and tugri_soni < 4:
            xabar = "❌ Yana urinib ko‘ring."
        else:
            xabar = None
    else:  # Barcha savollar ishlangan
        xabar = f"🎉 Siz barcha testlarni tugatdingiz! Umumiy natija: {tugri_soni}/{umumiy} ta."

    return render(request, 'natija.html', {
        'maruza': maruza,
        'foiz': foiz,
        'tugri': tugri_soni,
        'umumiy': umumiy,
        'javoblar': javoblar,
        'xabar': xabar
    })

@user_passes_test(lambda u: u.is_staff)
def add_savol(request):
    form = SavolForm()
    maruza_id = request.session.get('tanlangan_maruza')

    if request.method == 'POST':
        form = SavolForm(request.POST)
        if form.is_valid():
            maruza = form.cleaned_data['maruza']

            # Sessionga tanlangan maruzani saqlaymiz
            request.session['tanlangan_maruza'] = maruza.id

            # 10 tadan oshmasin
            if Savol.objects.filter(maruza=maruza).count() >= 10:
                messages.error(request, f"{maruza} uchun 10 ta savol allaqachon qo‘shilgan.")
                return redirect('add_savol')

            form.save()
            messages.success(request, "✅ Savol saqlandi.")

            # Agar 10 ta bo‘lsa, qaytaramiz
            if Savol.objects.filter(maruza=maruza).count() >= 10:
                messages.info(request, f"{maruza} uchun 10 ta test to‘ldi!")
                del request.session['tanlangan_maruza']
                return redirect('admin_dashboard')

            return redirect('add_savol')

    return render(request, 'add_savol.html', {'form': form})


