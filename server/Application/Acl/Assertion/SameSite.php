<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Model\User;
use Laminas\Permissions\Acl\Acl;
use Laminas\Permissions\Acl\Assertion\AssertionInterface;
use Laminas\Permissions\Acl\Resource\ResourceInterface;
use Laminas\Permissions\Acl\Role\RoleInterface;

class SameSite implements AssertionInterface
{
    /**
     * Assert that the object has been created by the current user
     *
     * @param Acl $acl
     * @param RoleInterface $role
     * @param ResourceInterface $resource
     * @param string $privilege
     *
     * @return bool
     */
    public function assert(Acl $acl, RoleInterface $role = null, ResourceInterface $resource = null, $privilege = null)
    {
        $object = $resource->getInstance();

        return User::getCurrent() && User::getCurrent()->getSite() === $object->getSite();
    }
}