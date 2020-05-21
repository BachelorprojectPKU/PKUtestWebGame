<?php
	// ----------------------------------------
	// new_game1bs.php
	// Part of Geneeskund PKU test, add new record times and results
	// example: bdgames.nl/geneeskunde/php/new_game1bs.php?studynr=99999&gamepart=1&BS_TIM01=580&BS_TIM02=26&BS_TIM03=372
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
	$arg_gamepart    = mysqli_real_escape_string($conn, $_POST['gamepart']);
	$arg_studynr     = mysqli_real_escape_string($conn, $_POST['studynr']);
	
	// array values to insert strings
	$arg_tim_fields = "";
	$arg_res_fields = "";
	$arg_tim = "";
	$arg_res = "";
	
	for ($x = 1; $x <= 32; $x++) {
		// get next time value
		$tim_nam = sprintf("BS_TIM%02d", $x);
		$tim_val = mysqli_real_escape_string($conn, $_POST[$tim_nam]);
		if (empty($tim_val)) $tim_val = "null";
		
		// add time fields and values to strings
		$arg_tim_fields .= "{$tim_nam},\n";
		$arg_tim .= "{$tim_val} as {$tim_nam},\n";
	}
	$arg_tim_fields = rtrim($arg_tim_fields, ",\n");
	$arg_tim = rtrim($arg_tim, ",\n");

	// missing game score parameters not allowed
	if (empty($arg_gamepart)) die('{"result":"ERROR","message":"gamepart parameter cannot be empty"}'); 
	if (empty($arg_studynr))  die('{"result":"ERROR","message":"studynr parameter cannot be empty"}'); 
	// gamepart level '0' allowed?? but empty('0') result in true
	//if (empty($arg_gamepart) && $arg_gamepart !== '0') die('{"result":"ERROR","message":"gamepart parameter cannot be empty"}'); 
	
	// allow missing device parameters, insert as NULL values
	//$arg_gamepart    = !empty($arg_gamepart)    ? "'$arg_gamepart'"    : "NULL";

	// insert into database
	$query = "INSERT INTO Game1bs (
				RECEIVEDATE,
				STUDYNR,
				BS_PART,
				$arg_tim_fields
			) 
			SELECT
				NOW() as RECEIVEDATE,
				'$arg_studynr'   as STUDYNR,
				'$arg_gamepart'  as BS_PART,
				$arg_tim
				";

	mysqli_query($conn, $query) or die('{"result":"ERROR","message":"error receiving game 1 add new, insert failed ' . mysqli_error($conn) . '"}'); 

	include 'closedb.php';

	// upload successful
	exit('{"result":"OK", "message":"game 1 add new reveived successfully 456"}');
?>