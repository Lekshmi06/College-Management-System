from django.urls import path,include
from .views import  RegisterUser, UserLogin, UserApprovalView
from .views import UserApprovalView, Department_manage,Student_manage,StudentPayment_manage,BusFee_manage,Fine_manage,Attendance_manage,NotificationListAPIView, AssignmentListAPIView,FilterStudent,FilterPayment, Get_teacher
from .views import GetStudent,Editstudent,PasswordResetView,Fiter_fine,Fiter_bus,Buss_single,Fine_single,Attendance_id,Teacher_Dept,StudentsAssignedToTeacher,AssignmentDetailAPIView,Stdt_id
#authentication
urlpatterns = [
   path('register/', RegisterUser.as_view(), name = "register" ),
   path('login/', UserLogin.as_view(), name = "login" ),
   path('approval/', UserApprovalView.as_view(), name="approval"),
   path('department/', Department_manage.as_view(), name = "department" ),
   path('student/', Student_manage.as_view(), name = "student" ),
   path('editstudent/<int:pk>/', Editstudent.as_view(), name = "editstudent" ),
   path('fine/', Fine_manage.as_view(), name = "fine" ),
   path('busfee/', BusFee_manage.as_view(), name = "busfee" ),
   path('paymentrecord/', StudentPayment_manage.as_view(), name = "paymentrecord" ),
   path('attendance/', Attendance_manage.as_view(), name = "attendance" ),
   path('notifications/', NotificationListAPIView.as_view(), name='notification-list'),
   path('assign/', AssignmentListAPIView.as_view(), name='assign'),
   path('filter/', FilterStudent.as_view(), name='filter'),
   path('paymentfilter/', FilterPayment.as_view(), name='paymentfilter'),
   path('get_teacher/', Get_teacher.as_view(), name = "get_teacher"),
   path('getstudent/', GetStudent.as_view(), name = "getstudent"),
   path('reset/', PasswordResetView.as_view(), name = "reset"),
   path('stdt_fine/<int:studentid>/', Fiter_fine.as_view(), name = "stdt_fine"),
   path('stdt_bus/<int:studentid>/', Fiter_bus.as_view(), name = "stdt_bus"),
   path('bus_id/<int:pk>/', Buss_single.as_view(), name = "bus_id"),
   path('fine_id/<int:pk>/', Fine_single.as_view(), name = "fine_id"),
   path('attendance_id/<int:pk>/', Attendance_id.as_view(), name = "attendance_id"), 
   path('teacher_dept/<int:dept_id>/', Teacher_Dept.as_view(), name = "teacher_dept"),
   path('teacher_student/<int:teacher_id>/', StudentsAssignedToTeacher.as_view(), name = "teacher_student"), 
   path('assignments/<student_id>/', AssignmentDetailAPIView.as_view(), name='assignment-detail'),
   path('stdt_id/<int:pk>/', Stdt_id.as_view(), name = "stdt_id"),
   

]