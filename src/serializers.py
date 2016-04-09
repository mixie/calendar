from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'title', 'fromdate', 'todate', 'public', 'wholeday', 'category', 'organized_by')

