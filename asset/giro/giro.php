<!DOCTYPE html>
<html>
<head>
    <title>Contoh Halaman PHP</title>
</head>
<body>
    <?php
    echo "<h2>Selamat Datang di Halaman PHP</h2>";
    ?>
    <!-- Konten HTML lainnya di sini -->


    <?php
$buah = array("Apel", "Jeruk", "Mangga");
?>

<ul>
<?php foreach ($buah as $b) { ?>
    <li><?php echo $b; ?></li>
<?php } ?>
</ul>

</body>
</html>