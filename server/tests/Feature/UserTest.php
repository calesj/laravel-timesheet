<?php
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;
    /**
     * TESTA SE A ROTA DE LOGIN ESTA FUNCIONANDO
     * @return void
     */
    public function test_user_login()
    {
        $user = $this->postJson('api/login', [
            'email' => 'admin@admin.com',
            'password' => 'admin'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $user['access_token'],
        ])->getJson('/api/user');

        $response->assertStatus(200);
    }

    /**
     * VERIFICA SE O USUARIO PODE ACESSAR A ROTA DO USUARIO, SEM ESTAR AUTENTICADO
     * @return void
     */
    public function test_user_auth()
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }
}
