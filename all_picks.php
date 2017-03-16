<?php include 'pdo.php'; ?>
<?php
// Create connection
$statement = $pdo->query("select * from pick where pick_year = ".$_GET['year']);
$results=$statement->fetchAll(PDO::FETCH_ASSOC);
$json=json_encode($results);
echo $json;
?>