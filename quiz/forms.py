from django import forms
from .models import Savol

class SavolForm(forms.ModelForm):
    class Meta:
        model = Savol
        fields = ['maruza', 'matn', 'variant_a', 'variant_b', 'variant_c', 'variant_d', 'togri_javob']
        widgets = {
            'matn': forms.Textarea(attrs={'rows': 3}),
        }

