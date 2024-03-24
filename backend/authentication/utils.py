import secrets
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import CustomUser
from django.contrib.auth.hashers import make_password
import random
import string


def generate_and_save_password(username):
    password = str(secrets.randbelow(1000000)).zfill(6) 
    print(password)
    
    # Retrieve the user instance
    try:
        user_instance = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        # Handle the case where the user doesn't exist
        # You may want to raise an exception or handle it differently based on your requirements
        return None
    
    # Update the password field of the user instance
    user_instance.password = make_password(password)
    user_instance.save()
    
    return password


def send_email(user_email, user_first_name):
    subject = 'Registration Application Successful'
    from_email = 'lekshmi.anilumar06@gmail.com'  
    recipient_list = [user_email]
    html_content = render_to_string('confirm_mail.html', {'first_name': user_first_name})
    text_content = strip_tags(html_content)   
    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def send_password(user_email, password):
    subject = 'Registration Approved'
    from_email = 'lekshmi.anilumar06@gmail.com' 
    recipient_list = [user_email]
    html_content = render_to_string('password_mail.html', {'password': password})
    text_content = strip_tags(html_content)   
    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")
    msg.send()    


def send_dissaprove(user_email, user_username):
    subject = 'Registration Disapproved'
    from_email = 'lekshmi.anilumar06@gmail.com'
    recipient_list = [user_email]
    html_content = render_to_string('disapprove_mail.html', {'user_name': user_username})
    text_content = strip_tags(html_content)   
    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")
    msg.send()  

