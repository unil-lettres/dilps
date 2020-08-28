<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Api\Server;
use Doctrine\ORM\EntityManager;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class GraphQLAction implements MiddlewareInterface
{
    private $entityManger;

    /**
     * @var string
     */
    private $site;

    public function __construct(EntityManager $entityManager, string $site)
    {
        $this->entityManger = $entityManager;
        $this->site = $site;
    }

    /**
     * Process an incoming server request and return a response, optionally delegating
     * to the next middleware component to create the response.
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $server = new Server(true, $this->site);

        $response = $server->execute($request);

        return new JsonResponse($response);
    }
}
