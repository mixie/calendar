from django.contrib import admin
from .models import Event, CategoryGroup, Category, IcsCalendar


class EventAdmin(admin.ModelAdmin):
    list_display = ('title',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title',)


class CategoryGroupAdmin(admin.ModelAdmin):
    list_display = ('title',)


class IcsAdmin(admin.ModelAdmin):
    list_display = ('title',)


admin.site.register(Event, EventAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(CategoryGroup, CategoryGroupAdmin)
admin.site.register(IcsCalendar, IcsAdmin)
