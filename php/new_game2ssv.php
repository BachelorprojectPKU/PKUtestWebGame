<?php
	// ----------------------------------------
	// new_game2ssv.php
	// Part of Geneeskund PKU test, add new record times and results
	// example: bdgames.nl/geneeskunde/php/new_game2ssv.php?studynr=99999&gamepart=1&SSV_TIM01=580&SSV_TIM02=26&SSV_TIM03=372
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
		$tim_nam = sprintf("SSV_TIM%02d", $x);
		$tim_val = mysqli_real_escape_string($conn, $_POST[$tim_nam]);
		if (empty($tim_val)) $tim_val = "null";

		// get next result value
		$res_nam = sprintf("SSV_RES%02d", $x);
		$res_val = mysqli_real_escape_string($conn, $_POST[$res_nam]);
		$res_val = (empty($res_val) ? "null" : "'$res_val'");

		// add time fields and values to strings
		$arg_tim_fields .= "{$tim_nam},\n";
		$arg_tim .= "{$tim_val} as {$tim_nam},\n";

		// add result fields and values to strings
		$arg_res_fields .= "{$res_nam},\n";
		$arg_res .= "{$res_val} as {$res_nam},\n";
	}
	// $arg_tim_fields = rtrim($arg_tim_fields, ",\n");
	// $arg_tim = rtrim($arg_tim, ",\n");
	
	$arg_res_fields = rtrim($arg_res_fields, ",\n");
	$arg_res = rtrim($arg_res, ",\n");

	// missing game score parameters not allowed
	if (empty($arg_gamepart)) die('{"result":"ERROR","message":"gamepart parameter cannot be empty"}'); 
	if (empty($arg_studynr))  die('{"result":"ERROR","message":"studynr parameter cannot be empty"}'); 
	// gamepart level '0' allowed?? but empty('0') result in true
	//if (empty($arg_gamepart) && $arg_gamepart !== '0') die('{"result":"ERROR","message":"gamepart parameter cannot be empty"}'); 
	
	// allow missing device parameters, insert as NULL values
	//$arg_gamepart    = !empty($arg_gamepart)    ? "'$arg_gamepart'"    : "NULL";

	// insert into database
	$query = "INSERT INTO Game2ssv (
				RECEIVEDATE,
				STUDYNR,
				SSV_PART,
				$arg_tim_fields
				$arg_res_fields
			) 
			SELECT
				NOW() as RECEIVEDATE,
				'$arg_studynr'   as STUDYNR,
				'$arg_gamepart'  as SSV_PART,
				$arg_tim
				$arg_res
				";

	mysqli_query($conn, $query) or die('{"result":"ERROR","message":"error receiving game 1 add new, insert failed ' . mysqli_error($conn) . '"}'); 

	include 'closedb.php';

	// upload successful
	exit('{"result":"OK", "message":"game 1 add new reveived successfully 456"}');
?>