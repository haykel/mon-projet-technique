from rest_framework import serializers
from .models import Devis

class DevisSerializer(serializers.ModelSerializer):
    # Affiche le username du user, en lecture seule
    user = serializers.ReadOnlyField(source='user.username')
    tarif = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    prime_totale = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Devis
        # On inclut user en lecture seule
        fields = [
            'id',
            'numero_opportunite',
            'user',
            'type_de_bien',
            'type_de_garantie',
            'destination_ouvrage',
            'types_travaux',
            'cout_ouvrage',
            'presence_existant',
            'client_vip',
            'souhaite_rcmo',
            'tarif',
            'prime_totale',
            'created_at',
        ]
        