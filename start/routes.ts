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
    router.put(':id/leave', [RoomsController, 'leave'])
    // TODO: criar testes para essa rota
    router.put(':id/start', [RoomsController, 'start'])
    // TODO: criar testes para essa rota
    router.put(':id/pause', [RoomsController, 'pause'])
  })
  .prefix('rooms')
