<?php
	// ----------------------------------------
	// get_dn.php
	// Part of Geneeskund PKU test, set deelnemer info at first time play
	// example: bdgames.nl/geneeskunde/php/set_dn.php?studynr=99999&dominant_hand=left&dob=01-01-2005
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
	$arg_hand     = mysqli_real_escape_string($conn, $_POST['dominant_hand']);
	$arg_dob      = mysqli_real_escape_string($conn, $_POST['dob']);

	// empty studynr parameters not allowed
	if (empty($arg_studynr)) die('{"result":"ERROR","message":"studynr parameter cannot be empty"}');
	// arg_hand '0' is allowed (=left), but empty('0') result in true
	if (empty($arg_hand) && $arg_hand !== '0') die('{"result":"ERROR","message":"dominant_hand parameter cannot be empty"}');
	//if (empty($arg_dob))     die('{"result":"ERROR","message":"dob parameter cannot be empty"}');

	// insert into database if not exists yet (unique constraint + IGNORE will ony insert if not exists yet)
	$query = "INSERT IGNORE INTO
					Deelnemer
				SET
					STUDYNR = '$arg_studynr',
					LASTUPDATE = NOW()
			";

	mysqli_query($conn, $query) or die('{"result":"ERROR","message":"error insert deelnemer: ' . mysqli_error($conn) . '"}'); 
	
	// update deelnemer in database
	$query = "UPDATE
				Deelnemer
			SET
				DOMINANT_HAND = $arg_hand,
				LASTUPDATE = NOW()
			WHERE
				STUDYNR = '$arg_studynr'
			";

	mysqli_query($conn, $query) or die('{"result":"ERROR","message":"error update deelnemer: ' . mysqli_error($conn) . '"}'); 

	include 'closedb.php';

	// upload successful
	exit('{"result":"OK", "message":"Deelnemer was updated successfully"}');
?>