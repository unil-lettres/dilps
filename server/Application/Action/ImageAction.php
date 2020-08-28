<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\Card;
use Application\Repository\CardRepository;
use Application\Service\ImageService;
use Laminas\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ImageAction extends AbstractAction
{
    /**
     * @var CardRepository
     */
    private $cardRepository;

    /**
     * @var ImageService
     */
    private $imageService;

    public function __construct(CardRepository $cardRepository, ImageService $imageService)
    {
        $this->cardRepository = $cardRepository;
        $this->imageService = $imageService;
    }

    /**
     * Serve an image from disk, with optional dynamic resizing
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $id = $request->getAttribute('id');

        /** @var Card $card */
        $card = $this->cardRepository->findOneById($id);
        if (!$card) {
            return $this->createError("Card $id not found in database");
        }

        $path = $card->getPath();
        if (!is_readable($path)) {
            return $this->createError("Image for card $id not found on disk, or not readable");
        }

        $maxHeight = (int) $request->getAttribute('maxHeight');
        if ($maxHeight) {
            $path = $this->imageService->resize($card, $maxHeight);
        }

        $resource = fopen($path, 'rb');
        $type = mime_content_type($path);
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $filename = $id . '.' . $extension;
        $response = new Response($resource, 200, ['content-type' => $type, 'Content-Disposition' => 'attachment; filename=' . $filename]);

        return $response;
    }
}
