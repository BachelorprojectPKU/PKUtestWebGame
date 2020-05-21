<?php
	// ----------------------------------------
	// new_dn.php
	// Part of Geneeskund PKU test, add or update deelnemer for access
	// example: bdgames.nl/geneeskunde/php/new_dn.php?studynr=12345&dob=2005-12-31
	// ----------------------------------------

	header('Access-Control-Allow-Origin: *'); // just for TESTING!!

	// server location of this script
	$DOCUMENT_ROOT = $_SERVER['DOCUMENT_ROOT'];
	if (substr ($DOCUMENT_ROOT, -1) == '/') { $DOCUMENT_ROOT = substr ($DOCUMENT_ROOT, 0, -1); }

	// connect to database
	include 'config.php';
	include 'opendb.php';
	
	// allow utf8 characters
	mysqli_set_charset($conn, "utf8mb4");

	// get arguments from url (note: function mysql_real_escape_string requires established connection to database)
	$arg_studynr  = mysqli_real_escape_string($conn, $_POST['studynr']);
	$arg_dob      = mysqli_real_escape_string($conn, $_POST['dob']);

	// empty studynr parameters not allowed
	if (empty($arg_studynr)) die('{"result":"ERROR","message":"studynr parameter cannot be empty"}');
	if (empty($arg_dob))     die('{"result":"ERROR","message":"dob parameter cannot be empty"}');

	// insert into database if not exists yet (unique constraint + IGNORE will ony insert if not exists yet)
	$query = "INSERT IGNORE INTO
					Deelnemer
				SET
					STUDYNR = '$arg_studynr',
					DOB = '$arg_dob',
					LASTUPDATE = NOW()
			";

	mysqli_query($conn, $query) or die('{"result":"ERROR","message":"error insert deelnemer: ' . mysqli_error($conn) . '"}'); 
	
	// update deelnemer in database
	$query = "UPDATE
				Deelnemer
			SET
				DOB = '$arg_dob',
				LASTUPDATE = NOW()
			WHERE
				STUDYNR = '$arg_studynr'
			";

	mysqli_query($conn, $query) or die('{"result":"ERROR","message":"error update deelnemer: ' . mysqli_error($conn) . '"}'); 

	include 'closedb.php';

	// upload successful
	exit('{"result":"OK", "message":"Deelnemer was updated successfully"}');
?>