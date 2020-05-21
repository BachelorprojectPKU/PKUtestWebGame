<?php
	// ----------------------------------------
	// PKU geneeskunde
	// download data as csv file
	// ----------------------------------------

	// server location of this script
	$DOCUMENT_ROOT = $_SERVER['DOCUMENT_ROOT'];
	if (substr ($DOCUMENT_ROOT, -1) == '/') { $DOCUMENT_ROOT = substr ($DOCUMENT_ROOT, 0, -1); }

	// connect to database
	include 'config.php';
	include 'opendb.php';

	// insert into database
	$query = "SELECT
				SC2ID,
				RECEIVEDATE,
				STUDYNR,
				SSV_PART,
				SSV_RES01,
				SSV_RES02,
				SSV_RES03,
				SSV_RES04,
				SSV_RES05,
				SSV_RES06,
				SSV_RES07,
				SSV_RES08,
				SSV_RES09,
				SSV_RES10,
				SSV_RES11,
				SSV_RES12,
				SSV_RES13,
				SSV_RES14,
				SSV_RES15,
				SSV_RES16,
				SSV_RES17,
				SSV_RES18,
				SSV_RES19,
				SSV_RES20,
				SSV_RES21,
				SSV_RES22,
				SSV_RES23,
				SSV_RES24,
				SSV_RES25,
				SSV_RES26,
				SSV_RES27,
				SSV_RES28,
				SSV_RES29,
				SSV_RES30,
				SSV_RES31,
				SSV_RES32,
				SSV_TIM01,
				SSV_TIM02,
				SSV_TIM03,
				SSV_TIM04,
				SSV_TIM05,
				SSV_TIM06,
				SSV_TIM07,
				SSV_TIM08,
				SSV_TIM09,
				SSV_TIM10,
				SSV_TIM11,
				SSV_TIM12,
				SSV_TIM13,
				SSV_TIM14,
				SSV_TIM15,
				SSV_TIM16,
				SSV_TIM17,
				SSV_TIM18,
				SSV_TIM19,
				SSV_TIM20,
				SSV_TIM21,
				SSV_TIM22,
				SSV_TIM23,
				SSV_TIM24,
				SSV_TIM25,
				SSV_TIM26,
				SSV_TIM27,
				SSV_TIM28,
				SSV_TIM29,
				SSV_TIM30,
				SSV_TIM31,
				SSV_TIM32
			FROM
				Game2ssv";

	$result = mysqli_query($conn, $query) or die('$$ERROR select query failed'); 

	// download csv file
	// https://stackoverflow.com/questions/16251625/how-to-create-and-download-a-csv-file-from-php-script
	
	$delimiter = ";";
    // open raw memory as file so no temp files needed, you might run out of memory though
    $f = fopen('php://memory', 'w'); 

	// loop over the data rows
	$first = true;
	foreach ($result as $row) { 
		// column name header
		if ($first) {
			fputcsv($f, array_keys($row), $delimiter);
			$first = false;
		}
        // generate csv lines from the inner arrays
        fputcsv($f, $row, $delimiter); 
    }
    // reset the file pointer to the start of the file
    fseek($f, 0);

    // tell the browser it's going to be a csv file
    header('Content-Type: application/csv');

    // tell the browser we want to save it instead of displaying it
    header('Content-Disposition: attachment; filename="game2ssv.csv";');

    // make php send the generated csv lines to the browser
    fpassthru($f);
	
	include 'closedb.php';
?>