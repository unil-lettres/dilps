<?php

namespace App\Action;

use App\Model\User;
use Doctrine\ORM\EntityManager;
use Interop\Http\ServerMiddleware\DelegateInterface;
use Interop\Http\ServerMiddleware\MiddlewareInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response\JsonResponse;

use GraphQL\Error\Debug;
use GraphQL\GraphQL;
use GraphQL\Server\StandardServer;
use GraphQL\Doctrine\DefaultFieldResolver;
use App\Api\Schema;

class GraphQLAction implements MiddlewareInterface
{
    private $entityManger;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManger = $entityManager;
    }

    /**
     * Process an incoming server request and return a response, optionally delegating
     * to the next middleware component to create the response.
     *
     * @param ServerRequestInterface $request
     * @param DelegateInterface $delegate
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, DelegateInterface $delegate)
    {

        GraphQL::setDefaultFieldResolver(new DefaultFieldResolver());

        $schema = new Schema();
        $server = new StandardServer([
            'schema' => $schema,
            'queryBatching' => true,
            'debug' => true,
        ]);

        $request = $request->withParsedBody(json_decode($request->getBody()->getContents(), true));
        $response = $server->executePsrRequest($request);

        return new JsonResponse($response);
    }
}
