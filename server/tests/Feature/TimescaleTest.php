<?php

namespace Tests\Feature;
use App\Models\Timescale;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimescaleTest extends TestCase
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
     * VERIFICA SE O USUARIO PODE ACESSAR A ROTA DO METODO index() DO TIMESCALE, SEM ESTAR AUTENTICADO
     * @return void
     */
    public function test_user_auth_timescale_index()
    {
        $response = $this->getJson('/api/timescale');

        $response->assertStatus(401);
    }

    /**
     * VERIFICA SE O USUARIO PODE ACESSAR A ROTA DO METODO show() DO TIMESCALE, SEM ESTAR AUTENTICADO
     * @return void
     */
    public function test_user_auth_timescale_show()
    {
        $response = $this->getJson('/api/timescale/1');

        $response->assertStatus(401);
    }

    /**
     * VERIFICA SE O USUARIO PODE ACESSAR A ROTA DO METODO store() DO TIMESCALE, SEM ESTAR AUTENTICADO
     * @return void
     */
    public function test_user_auth_timescale_store()
    {
        $response = $this->postJson('/api/timescale/', [
            [
                'nome' => 'nome do teste autenticado',
                'entrada' => '10:00:00',
                'saida' => '17:00:00'
            ]
        ]);

        $response->assertStatus(401);
    }

    /**
     * VERIFICA SE O USUARIO PODE ACESSAR A ROTA DO METODO show() DO TIMESCALE, SEM ESTAR AUTENTICADO
     * @return void
     */
    public function test_user_auth_timescale_update()
    {
        $response = $this->putJson('/api/timescale/1', [
            'nome' => 'nome do teste autenticado1',
            'entrada' => '10:00:01',
            'saida' => '17:00:01'
        ]);

        $response->assertStatus(401);
    }

    /**
     * VERIFICA SE O USUARIO PODE ACESSAR A ROTA DO METODO delete() DO TIMESCALE, SEM ESTAR AUTENTICADO
     * @return void
     */
    public function test_user_auth_timescale_delete()
    {
        $response = $this->deleteJson('/api/timescale/1');

        $response->assertStatus(401);
    }

    /**
     * VERIFICA SE O USUARIO AUTENTICADO PODE ACESSAR A ROTA DO METODO index() DO TIMESCALE
     * VERIFICA SE VAI RETORNAR A QUANTIDADE CERTA DE REGISTROS
     * @return void
     */
    public function test_timescale_index()
    {
        $timescale = Timescale::factory(9)->create();

        $response = $this->authenticateUser()->getJson('/api/timescale');

        $response->assertStatus(200);

        $response->assertJsonCount(10); // Verifica se há 10 registros na resposta JSON
    }

    /**
     * VERIFICA SE O USUARIO AUTENTICADO PODE ACESSAR A ROTA DO METODO show() DO TIMESCALE
     * VERIFICA SE VAI RETORNAR A QUANTIDADE CERTA DE REGISTROS, E SE VAI RETORNAR O REGISTRO CERTO
     * @return void
     */
    public function test_timescale_show()
    {
        $response = $this->authenticateUser()->getJson('/api/timescale/1');
        $response->assertStatus(200);
        $response->assertJson([
            'id' => 1
        ]);
    }

    /**
     * VERIFICA SE O USUARIO AUTENTICADO PODE ACESSAR A ROTA DO METODO store() DO TIMESCALE
     * E SE VAI RETORNAR O REGISTRO CERTO
     * @return void
     */
    public function test_timescale_store()
    {
        $response = $this->authenticateUser()->postJson('/api/timescale/', [
            'nome' => 'nome do teste autenticado',
            'entrada' => '10:00:00',
            'saida' => '17:00:00'
        ]);
        $response->assertStatus(200);
        $response->assertJson([
            'nome' => 'nome do teste autenticado',
            'entrada' => '10:00:00',
            'saida' => '17:00:00'
        ]);
    }

    /**
     * VERIFICA SE O USUARIO AUTENTICADO PODE ACESSAR A ROTA DO METODO update() DO TIMESCALE
     * E SE VAI RETORNAR O REGISTRO CERTO
     * @return void
     */
    public function test_timescale_update()
    {
        $response = $this->authenticateUser()->putJson('/api/timescale/1', [
            'nome' => 'nome do teste autenticado',
            'entrada' => '10:00:00',
            'saida' => '17:00:00'
        ]);
        $response->assertStatus(200);
        $response->assertJson([
            'nome' => 'nome do teste autenticado',
            'entrada' => '10:00:00',
            'saida' => '17:00:00',
            'id' => '1'
        ]);
    }

    /**
     * VERIFICA SE O USUARIO AUTENTICADO PODE ACESSAR A ROTA DO METODO delete() DO TIMESCALE
     * E SE VAI RETORNAR O REGISTRO CERTO
     * @return void
     */
    public function test_timescale_delete()
    {
        $response = $this->authenticateUser()->deleteJson('api/timescale/1');
        $response->assertStatus(200);
        $response->assertJson([
            "message" => "Item deletado com sucesso"
        ]);
    }
}
