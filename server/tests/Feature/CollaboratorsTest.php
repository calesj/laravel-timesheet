<?php

use App\Models\Collaborator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollaboratorsTest extends TestCase
{
    use RefreshDatabase;
    /**
     * Testa se a rota de criação de recursos da API retorna um status de sucesso.
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
     * VERIFICA SE O USUARIO PODE ACESSAR A ROTA DO USUARIO, SEM ESTAR AUTENTICADO
     * @return void
     */
    public function test_user_auth()
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }

    /**
     * VERIFICA SE O USUARIO PODE ACESSAR A ROTA DO METODO index() DO COLLABORATOR, SEM ESTAR AUTENTICADO
     * @return void
     */
    public function test_user_auth_collaborator_index()
    {
        $response = $this->getJson('/api/collaborator');

        $response->assertStatus(401);
    }

    /**
     * VERIFICA SE O USUARIO PODE ACESSAR A ROTA DO METODO show() DO COLLABORATOR, SEM ESTAR AUTENTICADO
     * @return void
     */
    public function test_user_auth_collaborator_show()
    {
        $response = $this->getJson('/api/collaborator/1');

        $response->assertStatus(401);
    }

    /**
     * VERIFICA SE O USUARIO AUTENTICADO PODE ACESSAR A ROTA DO METODO index() DO COLLABORATOR
     * VERIFICA SE VAI RETORNAR A QUANTIDADE CERTA DE REGISTROS
     * @return void
     */
    public function test_collaborator_index()
    {
        $collaborator = Collaborator::factory(9)->create();

        $response = $this->authenticateUser()->getJson('/api/collaborator');

        $response->assertStatus(200);

        $response->assertJsonCount(11); // Verifica se há 11 registros na resposta JSON
    }

    /**
     * VERIFICA SE O USUARIO AUTENTICADO PODE ACESSAR A ROTA DO METODO show() DO COLLABORATOR
     * VERIFICA SE VAI RETORNAR A QUANTIDADE CERTA DE REGISTROS, E SE VAI RETORNAR O REGISTRO CERTO
     * @return void
     */
    public function test_collaborator_show()
    {
        $collaborator = Collaborator::factory(9)->create();
        $response = $this->authenticateUser()->getJson('/api/collaborator/15');
        $response->assertStatus(200);
        $response->assertJson([
            'id' => 15
        ]);
    }
}
