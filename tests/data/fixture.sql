INSERT INTO `user` (`id`, `login`, `email`) VALUES
  (1000, 'Alice', 'alice@example.com');

INSERT INTO `collection` (`id`, `name`) VALUES
  (2000, 'Test collection 2000'),
  (2001, 'Test collection 2001');

INSERT INTO `artist` (`id`, `name`) VALUES
  (3000, 'Test artist 3000');

INSERT INTO `tag` (`id`, `name`) VALUES
  (4000, 'Test tag 4000');

INSERT INTO `institution` (`id`, `name`) VALUES
  (5000, 'Test institution 5000');

INSERT INTO `image` (`id`, `original_id`, `name`, `filename`) VALUES
  (6000, NULL, 'Test image 6000', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg'),
  (6001, NULL, 'Test suggestion image 6001', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg'),
  (6002, 6000, 'Test suggestion image 6002', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg');

INSERT INTO `image_artist` (`image_id`, `artist_id`) VALUES
  (6000, 3000);

INSERT INTO `image_tag` (`image_id`, `tag_id`) VALUES
  (6000, 4000);

INSERT INTO `collection_image` (`collection_id`, `image_id`) VALUES
  (2000, 6000),
  (2001, 6001),
  (2001, 6002);

INSERT INTO `change` (`id`, `original_id`, `suggestion_id`, `type`, `status`, `request`) VALUES
  (7000, null, 6001, 'create', 'new', 'I want to add new image to collection'),
  (7001, 6000, 6002, 'update', 'new', 'I want to edit existing image'),
  (7002, 6000, null, 'delete', 'new', 'I want to delete existing image');
