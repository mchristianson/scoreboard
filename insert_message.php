<?php include 'pdo.php'; ?>
<?php
// Create connection
$user_id = $_GET['user_id'];
$message = $_GET['message'];
$stmt = $pdo->prepare("INSERT INTO MESSAGE(user_id,MESSAGE,date_time) values (?,?,now())");
$stmt->execute(array($user_id, $message));
$affected_rows = $stmt->rowCount();
$last_inserted_id = $pdo->lastInsertId('id');
echo $last_inserted_id;
?>