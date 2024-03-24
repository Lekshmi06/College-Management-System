from urllib import request
from venv import logger
from django.shortcuts import render
from django.shortcuts import render
from django.shortcuts import render,get_object_or_404
from rest_framework.response import Response
from rest_framework import status, parsers
from django.db import transaction
from django.http import Http404

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .models import CustomUser,Department, BusFee,Fine,Student,StudentPaymentRecord, AttendanceRegister, Notification, Assignment
from .serializers import  UserSerializer, UserLoginSerializer, UserApprovalSerializer, DepartmentSerializer, StudentPaymentSerializer,StudentSerializer,FineSerializer,BusFeeSerializer, AttendenceSerializer, AssignmentSerializer, NotificationSerializer, PasswordResetSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions
from django.contrib import messages
from rest_framework.views import APIView
from django.db.models import Q
from django.db.models.signals import post_save
from django.http import HttpResponse
from django.dispatch import receiver
from django.template.loader import render_to_string
from .utils import  send_email, send_password, generate_and_save_password, send_dissaprove
from decimal import Decimal
from datetime import datetime, timedelta
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
# from .utils import generate_and_save_password, send_email, send_password
# authentication view.


class RegisterUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            
            
            
            user = serializer.save()

            send_email(user.email, user.first_name)

            return Response({'message':'mail sent successfully, Please verify.'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        user = CustomUser.objects.all()
        serializer = UserSerializer(user, many = True)
        return Response(serializer.data)
    


class UserLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')

            user = authenticate(request, username=username, password=password)
            if user is not None:
                expiration_time = datetime.utcnow() + timedelta(days=1)
                token = RefreshToken.for_user(user)
                
                # Creating token with payload
                token['name'] = user.username
                token['active'] = user.is_active
                token['teacher'] = user.is_teacher
                token['accountant'] = user.is_accountant
                token['is_superuser'] = user.is_superuser
                token['exp'] = expiration_time.timestamp()
                
                return Response({'token': str(token), 'access': str(token.access_token), 'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'message':"invalid credential"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            current_password = serializer.validated_data['current_password']
            new_password = serializer.validated_data['new_password']
            confirm_new_password = serializer.validated_data['confirm_new_password']

            try:
                user = CustomUser.objects.get(username=username)
            except CustomUser.DoesNotExist:
                return Response({'error':'User not found'}, status=status.HTTP_404_NOT_FOUND)  
            if new_password != confirm_new_password:
                     return Response({'error': 'New password and confirmation do not match'}, status=status.HTTP_400_BAD_REQUEST)
                
            if not user.check_password(current_password):
                     return Response({'error': 'Incorrect current password'}, status=status.HTTP_400_BAD_REQUEST)
                
            user.set_password(new_password)
            user.save()
       
            return Response({'detail': 'Password reset successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      

    
class UserApprovalView(APIView):
    def post(self, request):
        serializer = UserApprovalSerializer(data=request.data)
        

        if serializer.is_valid():
            user_id = serializer.validated_data.get('id')
            is_active = serializer.validated_data.get('is_active')

            if user_id is not None and is_active is not None:
                try:
                    user = CustomUser.objects.get(pk=user_id)
                    user.is_active = is_active
                    user.save()

                    if is_active:
                        password_instance = generate_and_save_password(user.username)
                        send_password(user.email, password_instance)
                        mark_notifications_as_read( notification_id=request.data.get('notification_id'))
 # Mark notifications as read for the user
                        return Response({'message': 'User approved successfully'}, status=status.HTTP_200_OK)
                    else:
                        send_dissaprove(user.email, user.username)
                        mark_notifications_as_read( notification_id=request.data.get('notification_id'))
 
                        user.delete()
                        # Mark notifications as read for the user
                        return Response({'message': 'User disapproved and deleted successfully'}, status=status.HTTP_200_OK)
                except CustomUser.DoesNotExist:
                    return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'error': 'Both user ID and is_active are required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user = CustomUser.objects.all()
        serializer = UserApprovalSerializer(user, many=True)
        return Response(serializer.data)


def mark_notifications_as_read( notification_id=None):
    print("Marking notifications as read...")
    
    notifications = Notification.objects.filter( is_read=False)
    if notification_id is not None:
        notifications = notifications.filter(id=notification_id)
    for notification in notifications:
        print(f"Marking notification {notification.id} as read")
        notification.is_read = True
        notification.save()


# ist 
# def mark_notifications_as_read(user):
#     print("Marking notifications as read...")
#     print(user)
#     notifications = Notification.objects.filter( is_read=False, )
#     for notification in notifications:
#         print(f"Marking notification {notification.id} as read")
#         notification.is_read = True
#         notification.save()


    


    




    
class Department_manage(APIView):
    def get(self, request):
        department = Department.objects.all()
        serializer = DepartmentSerializer(department, many=True)
        return Response(serializer.data)
    def post(self, request): 
        serializer = DepartmentSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)    
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)   
    
class Stdt_id(APIView):
    def get(self, request, pk):
        student = Student.objects.get(pk=pk) 
        serializer = StudentSerializer(student)  
        return Response(serializer.data)
    
class Editstudent(APIView): 

     
    def put(self, request, pk):
        try:
            student = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response({"message": f"Student not found with ID: {pk}"}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk, format=None):
        try:
            instance = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Student_manage(APIView):
    def get(self, request):
        department = Student.objects.all()
        serializer = StudentSerializer(department, many=True)
        return Response(serializer.data)
    def post(self, request): 
        serializer = StudentSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)    
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)  
    
class StudentsAssignedToTeacher(generics.ListAPIView):
    serializer_class = StudentSerializer

    def get_queryset(self):
        teacher_id = self.kwargs['teacher_id']  # Assuming 'teacher_id' is passed in the URL
        assignments = Assignment.objects.filter(teacher_id=teacher_id)
        students = [assignment.student for assignment in assignments]
        return students

class Fine_manage(APIView):
    
    def get(self, request):
        department = Fine.objects.all()
        serializer = FineSerializer(department, many=True)
        return Response(serializer.data)
    def post(self, request): 
        serializer = FineSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)    
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST) 
    
class Fine_single(APIView):  
    def get(self, request,pk):
        department = Fine.objects.filter(id = pk)
        serializer = FineSerializer(department, many=True)
        return Response(serializer.data)     
    def put(self, request,pk):
        try:
            # fine = Fine.objects.get(id=request.data.get('id'))
            fine = Fine.objects.get(pk=pk)
        except Fine.DoesNotExist:
            return Response({"message": "Fine not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = FineSerializer(fine, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get_object(self, pk):
        try:
            return Fine.objects.get(pk=pk)
        except Fine.DoesNotExist:
            raise Http404
    def delete(self, request, pk):
        fine = self.get_object(pk)
        fine.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class Fiter_fine(APIView):
    
    def get(self, request,studentid):
        department = Fine.objects.filter(student=studentid)
        serializer = FineSerializer(department, many=True)
        return Response(serializer.data)
    

class Fiter_bus(APIView):
    
    def get(self, request,studentid):
        department = BusFee.objects.filter(student=studentid)
        serializer = BusFeeSerializer(department, many=True)
        return Response(serializer.data)    
    
class BusFee_manage(APIView):
    def get(self, request):
        department = BusFee.objects.all()
        serializer = BusFeeSerializer(department, many=True)
        return Response(serializer.data)
    def post(self, request):
        student_id = request.data.get('student')
        if BusFee.objects.filter(student_id=student_id).exists():
            return Response({'error': 'Bus fee detail already exists for this student'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = BusFeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
class Buss_single(APIView):   
    def get(self, request,pk):
        department = BusFee.objects.filter(pk=pk)
        serializer = BusFeeSerializer(department, many=True)
        return Response(serializer.data)    
    def put(self, request,pk):
        try:
            bus_fee = BusFee.objects.get(pk=pk)
        except BusFee.DoesNotExist:
            return Response({"message": "Bus Fee not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = BusFeeSerializer(bus_fee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get_object(self, pk):
        try:
            return BusFee.objects.get(pk=pk)
        except BusFee.DoesNotExist:
            raise Http404  
    def delete(self, request, pk):
        bus_fee = self.get_object(pk)
        bus_fee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)               

class StudentPayment_manage(APIView):
    def get(self, request):
        payments = StudentPaymentRecord.objects.all()
        serializer = StudentPaymentSerializer(payments, many=True)
        return Response(serializer.data)
    
    def post(self, request): 
        serializer = StudentPaymentSerializer(data=request.data)
        if serializer.is_valid():
            # Save the serializer instance
            instance = serializer.save()
            # Obtain the id of the newly created payment record
            payment_record_id = instance.id
            # Call generate_bill() with the payment_record_id
            return generate_bill(request, payment_record_id)
            
            # return Response(serializer.data, status=status.HTTP_200_OK)

            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        payment_record = self.get_object(pk)
        serializer = StudentPaymentSerializer(payment_record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        payment_record = self.get_object(pk)
        payment_record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # def post(self, request): 
    #     serializer = StudentPaymentSerializer(data = request.data)
    #     if serializer.is_valid():
    #         instance = serializer.save()
            
    #         payment_record_id = instance.id
    #         generate_bill(payment_record_id)
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)    
        # return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST) 
class Get_teacher(APIView):
    def get(self,request):
        is_teacher  = True
        is_active = True
        teacher = CustomUser.objects.filter(is_teacher = is_teacher, is_active = is_active)   
        serializer = UserSerializer(teacher, many=True) 
        return Response(serializer.data)
    
class Teacher_Dept(APIView):
    def get(self,request,dept_id):
        is_teacher  = True
        is_active = True
        teacher = CustomUser.objects.filter(is_teacher = is_teacher, is_active = is_active,department=dept_id)   
        serializer = UserSerializer(teacher, many=True) 
        return Response(serializer.data)    

@receiver(post_save, sender=StudentPaymentRecord)
def update_bus_fee_and_fine_paid_status(sender, instance, created, **kwargs):
    if created:
        with transaction.atomic():  # Use a transaction for atomicity
            try:
                if instance.bus_fee:
                    instance.bus_fee.paid = True
                    instance.bus_fee.save()
                if instance.fine:
                    instance.fine.paid = True
                    instance.fine.save()
            except Exception as e:
                # Handle the error (e.g., log the error message)
                logger.error(f"Error updating paid status: {e}")

class Attendance_manage(APIView):
    def get(self, request):
        department = AttendanceRegister.objects.all()
        serializer = AttendenceSerializer(department, many=True)
        return Response(serializer.data)
    def post(self, request): 
        serializer = AttendenceSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)    
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)  

class Attendance_id(APIView):
   def get(self, request, pk):
        department = AttendanceRegister.objects.filter(student_id=pk)
        serializer = AttendenceSerializer(department, many=True)
        return Response(serializer.data)     
    
@receiver(post_save, sender=CustomUser)
def new_user_notification(sender, instance, created, **kwargs):
    if created:
        # Send notification to admin
        admin = CustomUser.objects.filter(is_superuser=True).first()
        if admin:
            Notification.objects.create(recipient=admin,  message=f"New user {instance.first_name} {instance.last_name}(ID: {instance.id}) has applied for registration.")

# Assuming you have a model for student assignments
# Adjust this signal based on your actual model structure
@receiver(post_save, sender=Assignment)
def student_assignment_notification(sender, instance, created, **kwargs):
    if created:
        teacher = instance.teacher
        student = instance.student
        if teacher:
            Notification.objects.create(recipient=teacher, message=f"You have been assigned a new student:{student.first_name} {student.last_name} (ID: {student.id}).")    

# class NotificationListAPIView(generics.ListAPIView):
#     serializer_class = NotificationSerializer 

#     def get(self, request):
#        user=1
#        notifications = Notification.objects.filter(recipient=user, is_read=False)
#        for notification in notifications:
#              notification.is_read = True
#              notification.save()
#        return Response (notification.data)

class NotificationListAPIView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # if not user.is_superuser:
        #      return Notification.objects.none()  # Return an empty queryset if user is not authenticated

        notifications = Notification.objects.filter(recipient=user, is_read=False)
        
        # for notification in notifications:
        #     notification.is_read = True
        #     notification.save()
        return notifications

def is_token_expired(token):
    access_token = AccessToken(token)
    print(token)
    return access_token.is_expired
    # def get_queryset(self):
    #     user = self.request.user
    #     return Notification.objects.filter(recipient=user)
    
class AssignmentListAPIView(generics.ListAPIView):
    serializer_class = AssignmentSerializer
    # permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Assignment.objects.filter(teacher=user)  
    def post(self, request):
        # Deserialize the incoming data
        serializer = AssignmentSerializer(data=request.data)
        
        # Validate the deserialized data
        if serializer.is_valid():
            # Save the validated data to create a new assignment instance
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # def put(self, request, *args, **kwargs):
    #     # Get the assignment instance to update
    #     instance = self.get_object()
        
    #     # Deserialize the incoming data with the instance
    #     serializer = AssignmentSerializer(instance, data=request.data)
        
    #     # Validate the deserialized data
    #     if serializer.is_valid():
    #         # Save the validated data to update the assignment instance
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AssignmentDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    lookup_url_kwarg = 'student_id'

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, student_id=self.kwargs.get(self.lookup_url_kwarg))
        self.check_object_permissions(self.request, obj)
        return obj

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# class AssignmentDetailAPIView(generics.RetrieveUpdateAPIView):
#     # queryset = Assignment.objects.all()
#     # serializer_class = AssignmentSerializer
#     # def put(self, request, *args, **kwargs):
#     #  instance = self.get_object()
#     #  serializer = self.get_serializer(instance, data=request.data)
#     #  if serializer.is_valid():
#     #       serializer.save()
#     #       return Response(serializer.data)
#     #  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request, id):
#         student = self.get_object(id)
#         serializer = AssignmentSerializer( data=request.data, student = student)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)

    # def put(self, request, *args, **kwargs):
    #     # Get the assignment instance
    #     instance = self.get_object()

    #     # Update the student ID if provided in the request data
    #     teacher = request.data.get('teacher')
    #     if teacher is not None:
    #         instance.teacher = teacher
    #         instance.save()

    #         # Serialize and return the updated assignment
    #         serializer = self.get_serializer(instance)
    #         return Response(serializer.data)

    #     # If student_id is not provided, return a bad request response
    #     return Response({'error': 'Student ID is required'}, status=status.HTTP_400_BAD_REQUEST)   

class FilterStudent(APIView):
    def get(self, request):
        # Extract admission_number from request query parameters
        admission_number = request.query_params.get('admission_number')
        
        if not admission_number:
            return Response({"error": "Admission number is required"}, status=400)
        
        # Filter students based on admission_number
        students = Student.objects.filter(admission_number=admission_number)
        
        if not students:
            return Response({"error": "No student found with the given admission number"}, status=404)
        
        # Serialize the queryset and return the response
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
    
class GetStudent(APIView):
    def get(self, request):
        # Extract admission_number from request query parameters
        student_id = request.query_params.get('id')
        
        if not student_id:
            return Response({"error": "id is required"}, status=400)
        
        # Filter students based on admission_number
        students = Student.objects.filter(id=student_id)
        
        if not students:
            return Response({"error": "No student found with the id"}, status=404)
        
        # Serialize the queryset and return the response
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)    
    
class FilterPayment(APIView)  :
      def get(self, request):
        # Extract admission_number from request query parameters
        admission_number = request.query_params.get('admission_number')
        
        if not admission_number:
            return Response({"error": "Admission number is required"}, status=400)
        
        # Filter students based on admission_number
        payment_record = StudentPaymentRecord.objects.filter(student__admission_number=admission_number)
        
        if not payment_record:
            return Response({"error": "No payment record found with the given admission number"}, status=404)
        
        # Serialize the queryset and return the response
        serializer = StudentPaymentSerializer(payment_record, many=True)
        return Response(serializer.data)
      



def generate_bill(request, payment_record_id):
    payment_record = StudentPaymentRecord.objects.get(id=payment_record_id)
    
    # Gather data needed for the bill
    student = payment_record.student
    student_name = student.first_name
    admission_number = student.admission_number
    date = payment_record.payment_date
    
    # if payment_record.semester_paid:
        # Access semester fee amount if it's stored in Student model
    semester_fee = student.semester_fees if payment_record.semester_paid else Decimal('0')
    # else:
    #     semester_fee = student.semester_fees if student.semester_fees else Decimal('0')
    
    # Access bus fee amount if it's stored in BusFee model
    bus_fee_amount = payment_record.bus_fee.fee_amount if payment_record.bus_fee else Decimal('0')
    
    # Access fine amount if it's stored in Fine model
    fine_amount = payment_record.fine.amount if payment_record.fine else Decimal('0')
    
    # Calculate total amount
    total_amount = semester_fee + bus_fee_amount + fine_amount
    print(student_name)
    print(admission_number)
    print(bus_fee_amount)
    print(fine_amount)
    print(total_amount)
    
    # Render the bill template with the data
    bill_data = {
        'payment_date': date,
        'student_name': student_name,
        'admission_number': admission_number,
        'semester_fee': semester_fee,
        'bus_fee_amount': bus_fee_amount,
        'fine_amount': fine_amount,
        'total_amount': total_amount
    }
    bill_html = render_to_string('bill_template.html', bill_data)
    
    # Create a PDF from the HTML (optional)
    # Use libraries like WeasyPrint or ReportLab to generate PDF from HTML
    
    # Return the bill as a downloadable PDF or render it as HTML
    # In this example, we render it as HTML
    return HttpResponse(bill_html)
