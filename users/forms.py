from django import forms
from django.contrib.auth.models import User
from .models import Talaba

class TalabaRegisterForm(forms.ModelForm):
    parol = forms.CharField(widget=forms.PasswordInput)
    parol_takror = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = Talaba
        fields = ['first_name', 'last_name', 'email', 'parol', 'parol_takror']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Bu email bilan foydalanuvchi allaqachon mavjud.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        parol = cleaned_data.get("parol")
        parol_takror = cleaned_data.get("parol_takror")

        if parol != parol_takror:
            raise forms.ValidationError("Parollar mos emas.")
        return cleaned_data

class MaruzaUploadForm(forms.Form):
    maruza_number = forms.IntegerField(label="Maruza raqami", min_value=1, max_value=15)
    file = forms.FileField(label="Yangi PDF yuklash")




