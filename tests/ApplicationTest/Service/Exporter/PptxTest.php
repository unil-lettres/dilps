<?php

declare(strict_types=1);

namespace ApplicationTest\Service\Exporter;

use Application\Service\Exporter\Pptx;
use ApplicationTest\Traits\TestWithTransaction;
use PhpOffice\PhpPresentation\PhpPresentation;
use ZipArchive;

class PptxTest extends AbstractWriter
{
    use TestWithTransaction;

    public function testWrite(): void
    {
        global $container;

        /** @var Pptx $writer */
        $writer = $container->get(Pptx::class);
        $tempFile = tempnam('data/tmp/', 'Pptx');

        $this->export($writer, $tempFile);

        $presentation = $this->readPresentation($tempFile);
        self::assertSame(1, $presentation->getSlideCount());
    }

    private function readPresentation(string $filename): PhpPresentation
    {
        // Assert that it is a valid ZIP file to prevent PhpSpreadsheet from hanging
        $zip = new ZipArchive();
        $res = $zip->open($filename, ZipArchive::CHECKCONS);
        self::assertTrue($res, 'exported Excel should be a valid ZIP file');
        $zip->close();

        // Re-read it
        $reader = new \PhpOffice\PhpPresentation\Reader\PowerPoint2007();
        $spreadsheet = $reader->load($filename);
        unlink($filename);

        return $spreadsheet;
    }
}
