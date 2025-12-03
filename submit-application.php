<?php
// AHR Mechanical Inc. - Job Application Form Handler
// Configure error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// Set headers for JSON response
header('Content-Type: application/json');

// Log request for debugging
file_put_contents('form_debug.log', date('Y-m-d H:i:s') . " - Form submission received\n", FILE_APPEND);

// Function to sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get and sanitize form data
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $phone = sanitizeInput($_POST['phone'] ?? '');
    $experience = sanitizeInput($_POST['experience'] ?? '');
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($phone) || empty($experience)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please fill in all required fields.'
        ]);
        exit;
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please enter a valid email address.'
        ]);
        exit;
    }
    
    // Email configuration
    $to = "contact@ahrcny.com";
    $subject = "New Job Application - AHR Mechanical Inc.";
    
    // Log email attempt
    file_put_contents('form_debug.log', date('Y-m-d H:i:s') . " - Preparing to send email to: $to\n", FILE_APPEND);
    file_put_contents('form_debug.log', date('Y-m-d H:i:s') . " - Name: $name, Email: $email, Phone: $phone\n", FILE_APPEND);
    
    // Create email body
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #18233B; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #18233B; }
            .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #2756FF; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Job Application Received</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Applicant Name:</div>
                    <div class='value'>{$name}</div>
                </div>
                
                <div class='field'>
                    <div class='label'>Email Address:</div>
                    <div class='value'>{$email}</div>
                </div>
                
                <div class='field'>
                    <div class='label'>Phone Number:</div>
                    <div class='value'>{$phone}</div>
                </div>
                
                <div class='field'>
                    <div class='label'>Experience:</div>
                    <div class='value'>" . nl2br($experience) . "</div>
                </div>
                
                <div style='margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;'>
                    <p>This application was submitted from the AHR Mechanical Inc. website on " . date('F j, Y \a\t g:i A') . "</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Email headers - Properly formatted for Hostinger
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: AHR Website <contact@ahrcny.com>" . "\r\n";
    $headers .= "Reply-To: {$email}" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    $mailSent = mail($to, $subject, $emailBody, $headers);
    
    // Log result
    file_put_contents('form_debug.log', date('Y-m-d H:i:s') . " - Mail sent result: " . ($mailSent ? 'SUCCESS' : 'FAILED') . "\n", FILE_APPEND);
    
    if ($mailSent) {
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your application! We will review your information and contact you soon.'
        ]);
    } else {
        // Log error details
        $error = error_get_last();
        file_put_contents('form_debug.log', date('Y-m-d H:i:s') . " - Error: " . print_r($error, true) . "\n", FILE_APPEND);
        
        echo json_encode([
            'success' => false,
            'message' => 'There was an error submitting your application. Please try again or contact us directly at contact@ahrcny.com.'
        ]);
    }
    
} else {
    file_put_contents('form_debug.log', date('Y-m-d H:i:s') . " - Invalid request method: " . $_SERVER["REQUEST_METHOD"] . "\n", FILE_APPEND);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
}
?>
