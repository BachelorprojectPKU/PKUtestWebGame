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
				SC1ID,
				RECEIVEDATE,
				STUDYNR,
				BS_PART,
				BS_TIM01,
				BS_TIM02,
				BS_TIM03,
				BS_TIM04,
				BS_TIM05,
				BS_TIM06,
				BS_TIM07,
				BS_TIM08,
				BS_TIM09,
				BS_TIM10,
				BS_TIM11,
				BS_TIM12,
				BS_TIM13,
				BS_TIM14,
				BS_TIM15,
				BS_TIM16,
				BS_TIM17,
				BS_TIM18,
				BS_TIM19,
				BS_TIM20,
				BS_TIM21,
				BS_TIM22,
				BS_TIM23,
				BS_TIM24,
				BS_TIM25,
				BS_TIM26,
				BS_TIM27,
				BS_TIM28,
				BS_TIM29,
				BS_TIM30,
				BS_TIM31,
				BS_TIM32
			FROM
				Game1bs";

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
    header('Content-Disposition: attachment; filename="game1bs.csv";');

    // make php send the generated csv lines to the browser
    fpassthru($f);
	
	include 'closedb.php';
?>