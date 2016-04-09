from django.contrib import admin
from .models import Event, Group, CategoryGroup, Category


class EventAdmin(admin.ModelAdmin):
    pass


class CategoryAdmin(admin.ModelAdmin):
    pass


class CategoryGroupAdmin(admin.ModelAdmin):
    pass


class GroupAdmin(admin.ModelAdmin):
    pass


admin.site.register(Event, EventAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(CategoryGroup, CategoryGroupAdmin)
