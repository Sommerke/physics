from django.db import models
from django.contrib.auth.models import User

class Maruza(models.Model):
    raqam = models.PositiveIntegerField(unique=True)
    nom = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Maruza {self.raqam}: {self.nom or ''}"

class Savol(models.Model):
    maruza = models.ForeignKey(Maruza, on_delete=models.CASCADE, related_name='savollar')
    matn = models.TextField()
    variant_a = models.CharField(max_length=200)
    variant_b = models.CharField(max_length=200)
    variant_c = models.CharField(max_length=200)
    variant_d = models.CharField(max_length=200)
    togri_javob = models.CharField(max_length=1, choices=[('A','A'),('B','B'),('C','C'),('D','D')])

    def __str__(self):
        return f"Q: {self.matn[:50]}..."

class Javob(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    savol = models.ForeignKey(Savol, on_delete=models.CASCADE)
    tanlangan_javob = models.CharField(max_length=1)
    is_togri = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.is_togri = self.tanlangan_javob == self.savol.togri_javob
        super().save(*args, **kwargs)
