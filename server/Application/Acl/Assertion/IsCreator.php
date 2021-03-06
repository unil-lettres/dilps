<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Model\AbstractModel;
use Application\Model\User;
use Ecodev\Felix\Acl\ModelResource;
use Laminas\Permissions\Acl\Acl;
use Laminas\Permissions\Acl\Assertion\AssertionInterface;
use Laminas\Permissions\Acl\Resource\ResourceInterface;
use Laminas\Permissions\Acl\Role\RoleInterface;

class IsCreator implements AssertionInterface
{
    /**
     * Assert that the object has been created by the current user
     *
     * @param \Application\Acl\Acl $acl
     * @param RoleInterface $role
     * @param ModelResource $resource
     * @param string $privilege
     *
     * @return bool
     */
    public function assert(Acl $acl, ?RoleInterface $role = null, ?ResourceInterface $resource = null, $privilege = null)
    {
        /** @var AbstractModel $object */
        $object = $resource->getInstance();

        return User::getCurrent() && User::getCurrent() === $object->getCreator();
    }
}
