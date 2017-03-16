<?php include 'pdo.php'; ?>
<?php
// Create connection
$user_id = $_GET['user_id'];
$pick_id = $_GET['pick_id'];
$year = $_GET['year'];
$stmt = $pdo->prepare("INSERT INTO pick(user_id,pick_id,pick_year) values (?,?,?)");
$stmt->execute(array($user_id, $pick_id, $year));
$affected_rows = $stmt->rowCount();
echo $affected_rows;
?>