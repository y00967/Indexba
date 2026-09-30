<?php
// ابدأ الجلسة والاتصال بقاعدة البيانات (كمثال)
session_start();

// افتراض أن معرف المستخدم مخزن في الجلسة بعد تسجيل الدخول
$user_id = $_SESSION['user_id'] ?? 1; // كمثال افتراضي للتوضيح

// معالجة الطلبات القادمة (رفع صورة أو إلغاء الاشتراك)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    // 1. معالجة تغيير الصورة الشخصية
    if (isset($_POST['action']) && $_POST['action'] === 'update_image') {
        if (isset($_FILES['profile_image'])) {
            $file = $_FILES['profile_image'];
            $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowed = ['jpg', 'jpeg', 'png', 'webp'];

            if (in_array($fileExt, $allowed)) {
                if ($file['size'] <= 2 * 1024 * 1024) { // الحد الأقصى 2 ميجابايت
                    $fileNameNew = "user_" . $user_id . "_" . time() . "." . $fileExt;
                    $uploadDir = 'uploads/';
                    
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0755, true);
                    }
                    
                    $fileDestination = $uploadDir . $fileNameNew;
                    
                    if (move_uploaded_file($file['tmp_name'], $fileDestination)) {
                        // هنا يتم تحديث مسار الصورة في قاعدة البيانات
                        // $pdo->prepare("UPDATE users SET profile_image = ? WHERE id = ?")->execute([$fileDestination, $user_id]);
                        
                        echo json_encode(['success' => true, 'message' => 'تم تحديث الصورة الشخصية بنجاح', 'url' => $fileDestination]);
                        exit;
                    }
                } else {
                    echo json_encode(['success' => false, 'message' => 'حجم الصورة يتجاوز الحد المسموح (2MB)']);
                    exit;
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'صيغة الملف غير مدعومة']);
                exit;
            }
        }
    }

    // 2. معالجة إلغاء الاشتراك / حذف الحساب
    if (isset($_POST['action']) && $_POST['action'] === 'cancel_subscription') {
        $password = $_POST['password'] ?? '';
        
        // هنا يجب التحقق من كلمة المرور الخاصة بالمستخدم من قاعدة البيانات
        // $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        // $stmt->execute([$user_id]);
        // $user = $stmt->fetch();
        // if (password_verify($password, $user['password'])) { ... }

        // نفترض أن التحقق تم بنجاح:
        // تغيير حالة الحساب إلى ملغي أو محذوف
        // $pdo->prepare("UPDATE users SET status = 'deactivated' WHERE id = ?")->execute([$user_id]);

        // تدمير الجلسة لتسجيل خروج المستخدم
        session_destroy();

        echo json_encode(['success' => true, 'message' => 'تم إلغاء الاشتراك وتعطيل الحساب بنجاح']);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعدادات الحساب الشخصي</title>
    <style>
        body { font-family: Tahoma, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; direction: rtl; }
        .container { max-width: 600px; background: #fff; padding: 30px; margin: auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .section { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .profile-img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #ddd; margin-bottom: 15px; }
        .btn { background: #007bff; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; }
        .btn:hover { background: #0056b3; }
        .btn-danger { background: #dc3545; }
        .btn-danger:hover { background: #a71d2a; }
        input[type="file"], input[type="password"] { display: block; margin: 10px 0; }
        .alert { padding: 10px; margin-top: 10px; border-radius: 5px; display: none; }
        .alert-success { background: #d4edda; color: #155724; }
        .alert-error { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>

<div class="container">
    <h2>إعدادات الحساب النهائي</h2>

    <!-- قسم الصورة الشخصية -->
    <div class="section">
        <h3>الصورة الشخصية</h3>
        <form id="imageUploadForm" enctype="multipart/form-data">
            <div>
                <img id="currentImage" src="default-avatar.png" alt="الصورة الشخصية" class="profile-img">
            </div>
            <input type="file" id="imageInput" name="profile_image" accept="image/*" required>
            <input type="hidden" name="action" value="update_image">
            <button type="submit" class="btn">حفظ وتغيير الصورة</button>
        </form>
        <div id="imageAlert" class="alert"></div>
    </div>

    <!-- قسم إلغاء الاشتراك / حذف الحساب -->
    <div class="section">
        <h3 style="color: #dc3545;">منطقة الخطر: إلغاء الاشتراك</h3>
        <p style="color: #666; font-size: 13px;">عند إلغاء الاشتراك، سيتم تعطيل حسابك وإيقاف جميع الخدمات المرتبطة به.</p>
        
        <form id="cancelSubForm">
            <label for="password">أدخل كلمة المرور للتأكيد:</label>
            <input type="password" id="password" name="password" required placeholder="كلمة المرور الحالية" style="padding: 8px; width: 100%; max-width: 300px; border: 1px solid #ccc; border-radius: 4px;">
            <input type="hidden" name="action" value="cancel_subscription">
            <br>
            <button type="submit" class="btn btn-danger">تأكيد إلغاء الاشتراك</button>
        </form>
        <div id="cancelAlert" class="alert"></div>
    </div>
</div>

<script>
    // معالجة نموذج الصورة الشخصية عبر AJAX
    document.getElementById('imageUploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let formData = new FormData(this);
        let alertBox = document.getElementById('imageAlert');

        fetch('', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alertBox.style.display = 'block';
            if (data.success) {
                alertBox.className = 'alert alert-success';
                alertBox.textContent = data.message;
                document.getElementById('currentImage').src = data.url; // تحديث الصورة فوريًا
            } else {
                alertBox.className = 'alert alert-error';
                alertBox.textContent = data.message;
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    });

    // معالجة نموذج إلغاء الاشتراك عبر AJAX
    document.getElementById('cancelSubForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!confirm('هل أنت متكد تماماً من رغبتك في إلغاء الاشتراك وحسابك؟')) {
            return;
        }

        let formData = new FormData(this);
        let alertBox = document.getElementById('cancelAlert');

        fetch('', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alertBox.style.display = 'block';
            if (data.success) {
                alertBox.className = 'alert alert-success';
                alertBox.textContent = data.message;
                setTimeout(() => {
                    window.location.href = 'index.php'; // التوجيه لصفحة الرئيسية بعد الإلغاء
                }, 2000);
            } else {
                alertBox.className = 'alert alert-error';
                alertBox.textContent = data.message;
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    });
</script>

</body>
</html>
