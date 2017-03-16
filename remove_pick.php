<?php include 'pdo.php'; ?>
<?php
// Create connection
$user_id = $_GET['user_id'];
$pick_id = $_GET['pick_id'];
$year = $_GET['year'];
$stmt = $pdo->prepare("DELETE FROM pick where user_id = ? and pick_id = ? and pick_year = ?");
$stmt->execute(array($user_id, $pick_id, $year));
$affected_rows = $stmt->rowCount();
echo $affected_rows;
?>