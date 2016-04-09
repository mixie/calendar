from rest_framework import viewsets, mixins
from .models import Event
from .serializers import EventSerializer


class EventViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
