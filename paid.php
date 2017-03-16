<?php include 'pdo.php'; ?>
<?php
// Create connection
$statement = $pdo->query("select p.user_id, count(*) as count, u.paid from pick p join user u on u.name = p.user_id where p.pick_year = ".$_GET['year']." group by p.user_id");
$results=$statement->fetchAll(PDO::FETCH_ASSOC);
$json=json_encode($results);
echo $json;
?>