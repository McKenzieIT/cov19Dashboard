"""
Test
"""
# from django.test import TestCase
# from django.http import HttpResponse
from django.shortcuts import render

# Create your tests here.

def test(request):
    return render(request, 'test.html')
