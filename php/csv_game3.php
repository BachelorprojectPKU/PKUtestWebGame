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
				SC3ID,
				RECEIVEDATE,
				STUDYNR,
				FI_RES01,
				FI_RES02,
				FI_RES03,
				FI_RES04,
				FI_RES05,
				FI_RES06,
				FI_RES07,
				FI_RES08,
				FI_RES09,
				FI_RES10,
				FI_RES11,
				FI_RES12,
				FI_RES13,
				FI_RES14,
				FI_RES15,
				FI_RES16,
				FI_RES17,
				FI_RES18,
				FI_RES19,
				FI_RES20,
				FI_RES21,
				FI_RES22,
				FI_RES23,
				FI_RES24,
				FI_RES25,
				FI_RES26,
				FI_RES27,
				FI_RES28,
				FI_RES29,
				FI_RES30,
				FI_RES31,
				FI_RES32,
				FI_RES33,
				FI_RES34,
				FI_RES35,
				FI_RES36,
				FI_RES37,
				FI_RES38,
				FI_RES39,
				FI_RES40,
				FI_RES41,
				FI_RES42,
				FI_RES43,
				FI_RES44,
				FI_RES45,
				FI_RES46,
				FI_RES47,
				FI_RES48,
				FI_RES49,
				FI_RES50,
				FI_RES51,
				FI_RES52,
				FI_RES53,
				FI_RES54,
				FI_RES55,
				FI_RES56,
				FI_RES57,
				FI_RES58,
				FI_RES59,
				FI_RES60,
				FI_RES61,
				FI_RES62,
				FI_RES63,
				FI_RES64,
				FI_RES65,
				FI_RES66,
				FI_RES67,
				FI_RES68,
				FI_RES69,
				FI_RES70,
				FI_RES71,
				FI_RES72,
				FI_RES73,
				FI_RES74,
				FI_RES75,
				FI_RES76,
				FI_RES77,
				FI_RES78,
				FI_RES79,
				FI_RES80,
				FI_TIM01,
				FI_TIM02,
				FI_TIM03,
				FI_TIM04,
				FI_TIM05,
				FI_TIM06,
				FI_TIM07,
				FI_TIM08,
				FI_TIM09,
				FI_TIM10,
				FI_TIM11,
				FI_TIM12,
				FI_TIM13,
				FI_TIM14,
				FI_TIM15,
				FI_TIM16,
				FI_TIM17,
				FI_TIM18,
				FI_TIM19,
				FI_TIM20,
				FI_TIM21,
				FI_TIM22,
				FI_TIM23,
				FI_TIM24,
				FI_TIM25,
				FI_TIM26,
				FI_TIM27,
				FI_TIM28,
				FI_TIM29,
				FI_TIM30,
				FI_TIM31,
				FI_TIM32,
				FI_TIM33,
				FI_TIM34,
				FI_TIM35,
				FI_TIM36,
				FI_TIM37,
				FI_TIM38,
				FI_TIM39,
				FI_TIM40,
				FI_TIM41,
				FI_TIM42,
				FI_TIM43,
				FI_TIM44,
				FI_TIM45,
				FI_TIM46,
				FI_TIM47,
				FI_TIM48,
				FI_TIM49,
				FI_TIM50,
				FI_TIM51,
				FI_TIM52,
				FI_TIM53,
				FI_TIM54,
				FI_TIM55,
				FI_TIM56,
				FI_TIM57,
				FI_TIM58,
				FI_TIM59,
				FI_TIM60,
				FI_TIM61,
				FI_TIM62,
				FI_TIM63,
				FI_TIM64,
				FI_TIM65,
				FI_TIM66,
				FI_TIM67,
				FI_TIM68,
				FI_TIM69,
				FI_TIM70,
				FI_TIM71,
				FI_TIM72,
				FI_TIM73,
				FI_TIM74,
				FI_TIM75,
				FI_TIM76,
				FI_TIM77,
				FI_TIM78,
				FI_TIM79,
				FI_TIM80
			FROM
				Game3fi";

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
    header('Content-Disposition: attachment; filename="game3fi.csv";');

    // make php send the generated csv lines to the browser
    fpassthru($f);
	
	include 'closedb.php';
?>