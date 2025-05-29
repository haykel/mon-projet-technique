from rest_framework import viewsets, permissions
from .models import Devis
from .serializers import DevisSerializer

class DevisViewSet(viewsets.ModelViewSet):
    serializer_class    = DevisSerializer
    permission_classes  = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Devis.objects.all()
        return Devis.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)