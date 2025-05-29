from django import forms
from .models import Devis

class DevisForm(forms.ModelForm):
    class Meta:
        model = Devis
        fields = [
            'numero_opportunite','nom_client',
            'type_de_bien','type_de_garantie',
            'destination_ouvrage','types_travaux',
            'cout_ouvrage','presence_existant',
            'client_vip','souhaite_rcmo',
        ]