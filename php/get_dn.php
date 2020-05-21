<?php
	// ----------------------------------------
	// get_dn.php
	// Part of Geneeskund PKU test, get deelnemer info at the start
	// example: http://bdrgames.nl/geneeskunde/php/get_dn.php?studynr=99999
	// example: http://bdrgames.nl/geneeskunde/php/get_dn.php?studynr=12345&dob=2010-01-01
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
	$arg_studynr = mysqli_real_escape_string($conn, $_GET['studynr']);
	$arg_dob     = mysqli_real_escape_string($conn, $_GET['dob']);

	// empty studynr parameters not allowed
	if (empty($arg_studynr)) die('{"result":"ERROR","message":"studynr parameter cannot be empty"}');

	// get all completed games
	$query = "select
				STUDYNR
			from
				Deelnemer
			where
				STUDYNR = '$arg_studynr'
			";

	// date-of-birth is optional, but if given then it should match
	if (!empty($arg_dob)) {
		$query .= "and DOB = '$arg_dob'";
	}

	$sqldata = mysqli_query($conn, $query) or die('{"result":"ERROR","message":"error getting studynr failed ' . mysqli_error($conn) . '"}'); 
	
	// get all and group by gamename
	$partscompleted = array();

	// deelnemer bestaat niet, geen toegang
	if (mysqli_num_rows($sqldata) == 0) {
		// return -1 for no access
		$partscompleted[] = array('game' => '-1', 'part' => '-1');
	} else {
		// check for max. completed game part
		$query = "select
					game, part
				from
					(
						  select 0 as game, 0        as part from Deelnemer where STUDYNR = '$arg_studynr'
					union select 1 as game, BS_PART  as part from Game1bs   where STUDYNR = '$arg_studynr'
					union select 2 as game, SSV_PART as part from Game2ssv  where STUDYNR = '$arg_studynr'
					union select 3 as game, FI_PART  as part from Game3fi   where STUDYNR = '$arg_studynr'
					union select 4 as game, IFE_PART as part from Game4ife  where STUDYNR = '$arg_studynr'
					) a
				order by
					game desc, part desc
				limit 1
				";

		$sqldata = mysqli_query($conn, $query) or die('{"result":"ERROR","message":"error getting studynr failed ' . mysqli_error($conn) . '"}'); 
		
		while($r = mysqli_fetch_assoc($sqldata)) {
			$partscompleted[] = $r;
		}
	}

	include 'closedb.php';

	// return json list
	exit(json_encode($partscompleted));
?>