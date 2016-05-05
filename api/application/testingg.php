<?php 
echo "asd";
$to = 'nimitw@gmail';
		$subject = "Easywaylead verification";

		$message = '
		<html>
		<head>
		<title>Registration verification</title>
		</head>
		<body>
				
				<div class="mail-box">
					<div class="mail-body">
						<p>Dear</p>
						<br>
						<p>Thank you for registering on our site. Please click on below link to verify yourself.</p><br>
						<a href="http://easywaylead.com/register/verification/">Click here to verify.</a>
						<div class="logo-element"> <a href="#"><img src="<?php echo base_url("assets/img/logo-l.png"); ?>" alt=""></a></div>
					</div>
				</div>
		</body>
		</html>
		';

		// Always set content-type when sending HTML email
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

		// More headers

		mail($to,$subject,$message,$headers);
?>