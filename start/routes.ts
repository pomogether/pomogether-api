/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const RoomsController = () => import('#controllers/rooms')

router.get('/', async () => {
  return { hello: 'world' }
})

router
  .group(async () => {
    router.get('', [RoomsController, 'list'])
    router.get(':id', [RoomsController, 'show'])
    router.post('', [RoomsController, 'create'])
    router.put(':id/join', [RoomsController, 'join'])
    // router.post(':id/leave', [RoomsController, 'leave'])
    router.put(':id/start', [RoomsController, 'start'])
    router.put(':id/pause', [RoomsController, 'pause'])
  })
  .prefix('rooms')
