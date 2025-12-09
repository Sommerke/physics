from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class Talaba(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='talaba_profile')
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    parol = models.CharField(max_length=128) # Heshlangan parol saqlanadi
    parol_takror = models.CharField(max_length=128, blank=True, null=True) # Bu bazada saqlanmaydi, faqat validatsiya uchun

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        # Parol kiritilganda uni heshlash
        if self.parol and self.parol != self.user.password:
            self.parol = make_password(self.parol)
            self.user.password = self.parol
            self.user.save()
        elif not self.user_id:
            # Yangi foydalanuvchi yaratilganda User obyektini ham yaratish
            user = User.objects.create(username=self.email, email=self.email, password=self.parol)
            self.user = user
            self.parol = user.password # Heshlangan parolni saqlash
        super().save(*args, **kwargs)

    @property
    def username(self):
        return self.user.username

    @username.setter
    def username(self, value):
        self.user.username = value


