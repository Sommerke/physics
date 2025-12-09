import os
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import user_passes_test
from django.core.files.storage import FileSystemStorage
from django.contrib import messages
from .forms import TalabaRegisterForm, MaruzaUploadForm
from .models import Talaba
from quiz.models import Maruza, Savol, Javob

# === Asosiy kirish sahifasi ===
def asosiy_view(request):
    return redirect('asosiy_nazariy')

# === Nazariy bo'lim ===
def asosiy_nazariy_view(request):
    maruzalar = Maruza.objects.order_by('raqam')
    ochiq_maruza = 1 
    for maruza in maruzalar:
        savollar = Savol.objects.filter(maruza=maruza)
        javoblar = Javob.objects.filter(user=request.user, savol__in=savollar, is_togri=True).count()
        if savollar.count() == 0:
            break 
        elif javoblar >= 5:
            ochiq_maruza = maruza.raqam + 1
        else:
            break

    testlar = Savol.objects.filter(maruza__raqam=ochiq_maruza)

    return render(request, 'asosiy.html', {
        'active_section': 'nazariy',
        'maruzalar': range(1, 16),
        'ochiq_maruza': ochiq_maruza,
        'testlar': testlar,
        'amaliylar': range(1, 16),
        'videolar': range(1, 16),
    })

# === Amaliy bo'lim ===
def asosiy_amaliy_view(request):
    return render(request, 'asosiy.html', {
        'active_section': 'amaliy',
        'maruzalar': range(1, 16),
        'amaliylar': range(1, 16),
        'videolar': range(1, 16),
    })

# === Video bo'lim ===
def asosiy_video_view(request):
    return render(request, 'asosiy.html', {
        'active_section': 'video',
        'maruzalar': range(1, 16),
        'amaliylar': range(1, 16),
        'videolar': range(1, 16),
    })

# === Testlarni yuborish ===
def test_yuborish(request, raqam):
    maruza = get_object_or_404(Maruza, raqam=raqam)
    if request.method == 'POST':
        savollar = maruza.savollar.all()
        togrilar = 0
        jami = savollar.count()

        for savol in savollar:
            tanlangan = request.POST.get(f'savol_{savol.id}')
            if tanlangan:
                Javob.objects.update_or_create(
                    user=request.user,
                    savol=savol,
                    defaults={'tanlangan_javob': tanlangan}
                )
                if tanlangan == savol.togri_javob:
                    togrilar += 1
        return redirect('asosiy_nazariy')
    return redirect('asosiy_nazariy')

# === Foydalanuvchini ro‘yxatdan o‘tkazish ===
def register_view(request):
    if request.method == 'POST':
        form = TalabaRegisterForm(request.POST)
        if form.is_valid():
            parol = form.cleaned_data['parol']
            user = User.objects.create_user(
                username=form.cleaned_data['email'],
                email=form.cleaned_data['email'],
                password=parol,
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name']
            )
            Talaba.objects.create(
                user=user,
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
                email=form.cleaned_data['email']
            )
            login(request, user)
            return redirect('login')
    else:
        form = TalabaRegisterForm()
    return render(request, 'register.html', {'form': form})

# === Login ===
def login_view(request):
    error = None
    if request.method == 'POST':
        email = request.POST.get('email')
        parol = request.POST.get('parol')
        user = authenticate(request, username=email, password=parol)
        if user:
            login(request, user)
            return redirect('asosiy_nazariy')
        else:
            error = "Email yoki parol noto'g'ri"
    return render(request, 'login.html', {'error': error})


# === Admin dashboard ===
def admin_dashboard_view(request):
    users = User.objects.all()
    maruza_form = MaruzaUploadForm()

    # 1 dan 15 gacha raqamlarni yuboramiz
    maruzalar = range(1, 16)

    if request.method == 'POST':
        maruza_form = MaruzaUploadForm(request.POST, request.FILES)
        if maruza_form.is_valid():
            number = maruza_form.cleaned_data['maruza_number']
            file = maruza_form.cleaned_data['file']

            save_dir = os.path.join(settings.BASE_DIR, "static", "maruza")
            os.makedirs(save_dir, exist_ok=True)

            fs = FileSystemStorage(location=save_dir)
            file_name = f"maruza_{number}.pdf"

            if fs.exists(file_name):
                fs.delete(file_name)

            fs.save(file_name, file)
            messages.success(request, f"✅ Maruza {number} muvaffaqiyatli almashtirildi.")

            return redirect("admin_dashboard")

    return render(request, 'admin_dashboard.html', {
        'users': users,
        'maruza_form': maruza_form,
        'maruzalar': maruzalar,   # 🔥 mana shu qo‘shildi
    })


# === Foydalanuvchini o'chirish ===
def delete_user(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    if user.is_staff:
        messages.error(request, "Admin foydalanuvchini o‘chira olmaysiz.")
    else:
        user.delete()
        messages.success(request, "Foydalanuvchi o‘chirildi.")
    return redirect('admin_dashboard')

# === Foydalanuvchini yangilash ===
@user_passes_test(lambda u: u.is_staff)
def update_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        user.save()
        messages.success(request, "Foydalanuvchi ma'lumotlari yangilandi.")
    return redirect('admin_dashboard')

