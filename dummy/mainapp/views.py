from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User, Group

def calendar(request):
    return render(request, 'mainapp/calendar.html', {})


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        groups = request.POST.getlist('group')
        user = User.objects.create(username=username)
        user.set_password(password)
        user.save()
        print "GROUPS:", groups
        for g in groups:
            g = Group.objects.get(id=g)
            g.user_set.add(user)
            g.save()
        return HttpResponseRedirect('/login/')
    else:
        return render(request, 'mainapp/register.html',
                      {'groups': Group.objects.all()})


def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)

        if user:
                login(request, user)
                return HttpResponseRedirect('/')
        else:
            print "Invalid login details: {0}, {1}".format(username, password)
            return HttpResponse("Invalid login details supplied.")
    else:
        return render(request, 'mainapp/login.html', {})