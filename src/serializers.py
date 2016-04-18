from rest_framework import serializers
from .models import Event, Group, Category, CategoryGroup, IcsCalendar


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'title', 'start', 'end', 'public', 'allDay', 'categories', 'groups',)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'title')


class CategoryGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryGroup
        fields = ('id', 'title')


class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = ('id', 'title', 'category_group')

class IcsCalendarSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = IcsCalendar
        fields = ('id', 'title', 'url', 'public', 'categories', 'groups')