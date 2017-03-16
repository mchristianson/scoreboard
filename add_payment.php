<?php include 'pdo.php'; ?>
<?php
// Create connection
$paid = $_GET['paid'];
$user_id = $_GET['user_id'];
$stmt = $pdo->prepare("UPDATE user set paid = ? where name = ?");
$stmt->execute(array($paid, $user_id));
$affected_rows = $stmt->rowCount();
echo $affected_rows;
?>