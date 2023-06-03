<?php
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;
    /**
     * FAZ O LOGIN DE USUARIO COM PRIVILEGIOS DE ADMINISTRADOR
     */
    private function authenticateUser()
    {
        $user = $this->postJson('api/login', [
            'email' => 'admin@admin.com',
            'password' => 'admin'
        ]);

        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $user['access_token'],
        ]);
    }

    /**
     * FAZ O LOGIN DE UM USUARIO SEM PRIVILEGIO DE ADMINISTRADOR
     * @return UserTest
     */
    private function authenticateUserNoAdmin()
    {
        $user = $this->postJson('api/login', [
            'email' => 'teste@teste.com',
            'password' => '12345678'
        ]);

        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $user['access_token'],
        ]);
    }

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

    /**
     * TENTA ACESSAR UMA ROTA DE ADMISTRADOR SEM ESTAR AUTENTICADO
     * @return void
     */
    public function test_user_auth_admin()
    {
        $response = $this->getJson('api/admin');
        $response->assertStatus(401);
    }

    /**
     * TENTA ACESSAR UMA ROTA DE ADMINISTRADOR ESTANDO AUTENTICADO, MAS SEM PRIVILEGIOS DE ADMIN
     * @return void
     */
    public function test_user_admin()
    {
        $response = $this->authenticateUserNoAdmin()->getJson('api/admin');
        $response->assertStatus(403);
        $response->assertJson(['message' => "acesso negado"]);
    }

    /**
     * TENTA ACESSAR UMA ROTA DE ADMINISTRADOR ESTANDO AUTENTICADO, E COM PRIVILEGIOS DE ADMINISTRADOR
     * @return void
     */
    public function test_user_admin_check()
    {
        $response = $this->authenticateUser()->getJson('api/admin');
        $response->assertStatus(200);
    }

    /**
     * VERIFICA SE O USUARIO NAO AUTENTICADO CONSEGUE FAZER O REGISTRO DE OUTRO USUARIO
     * @return void
     */
    public function test_user_auth_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'tales teste',
            'email' => 'tales@email.com',
            'password' => '12345678',
            'cpf' => 'teste',
            'matricula' => 'teste',
            "timescale_id" => "1"
        ]);

        $response->assertStatus(401);
    }

    /**
     * VERIFICA SE O USUARIO AUTENTICADO, MAS SEM PRIVILEGIOS DE ADMINISTRADOR, CONSEGUE CRIAR UM USUARIO
     * @return void
     */
    public function test_user_auth_register_admin()
    {
        $response = $this->authenticateUserNoAdmin()->postJson('/api/register', [
            'name' => 'tales teste',
            'email' => 'tales@email.com',
            'password' => '12345678',
            'cpf' => 'teste',
            'matricula' => 'teste',
            "timescale_id" => "1"
        ]);

        $response->assertStatus(403);
        $response->assertJson(['message' => "acesso negado"]);
    }

    /**
     * VERIFICA SE O USUARIO ADMINISTRADOR CONSEGUE FAZER O REGISTRO DE OUTRO USUARIO
     * @return void
     */
    public function test_user_register()
    {
        $response = $this->authenticateUser()->postJson('/api/register', [
            'name' => 'tales teste',
            'email' => 'tales@email.com',
            'password' => '12345678',
            'cpf' => 'teste',
            'matricula' => 'teste',
            "timescale_id" => "1"
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'cpf' => 'teste',
            'matricula' => 'teste',
            "timescale_id" => "1"
        ]);
    }
}
