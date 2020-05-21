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
				SC4ID,
				RECEIVEDATE,
				STUDYNR,
				IFE_PART,
				IFE_RES01,
				IFE_RES02,
				IFE_RES03,
				IFE_RES04,
				IFE_RES05,
				IFE_RES06,
				IFE_RES07,
				IFE_RES08,
				IFE_RES09,
				IFE_RES10,
				IFE_RES11,
				IFE_RES12,
				IFE_RES13,
				IFE_RES14,
				IFE_RES15,
				IFE_RES16,
				IFE_RES17,
				IFE_RES18,
				IFE_RES19,
				IFE_RES20,
				IFE_RES21,
				IFE_RES22,
				IFE_RES23,
				IFE_RES24,
				IFE_RES25,
				IFE_RES26,
				IFE_RES27,
				IFE_RES28,
				IFE_RES29,
				IFE_RES30,
				IFE_RES31,
				IFE_RES32,
				IFE_RES33,
				IFE_RES34,
				IFE_RES35,
				IFE_RES36,
				IFE_RES37,
				IFE_RES38,
				IFE_RES39,
				IFE_RES40,
				IFE_TIM01,
				IFE_TIM02,
				IFE_TIM03,
				IFE_TIM04,
				IFE_TIM05,
				IFE_TIM06,
				IFE_TIM07,
				IFE_TIM08,
				IFE_TIM09,
				IFE_TIM10,
				IFE_TIM11,
				IFE_TIM12,
				IFE_TIM13,
				IFE_TIM14,
				IFE_TIM15,
				IFE_TIM16,
				IFE_TIM17,
				IFE_TIM18,
				IFE_TIM19,
				IFE_TIM20,
				IFE_TIM21,
				IFE_TIM22,
				IFE_TIM23,
				IFE_TIM24,
				IFE_TIM25,
				IFE_TIM26,
				IFE_TIM27,
				IFE_TIM28,
				IFE_TIM29,
				IFE_TIM30,
				IFE_TIM31,
				IFE_TIM32,
				IFE_TIM33,
				IFE_TIM34,
				IFE_TIM35,
				IFE_TIM36,
				IFE_TIM37,
				IFE_TIM38,
				IFE_TIM39,
				IFE_TIM40
			FROM
				Game4ife";

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
    header('Content-Disposition: attachment; filename="game4ife.csv";');

    // make php send the generated csv lines to the browser
    fpassthru($f);
	
	include 'closedb.php';
?>