package com.store.BACK.config;

import com.store.BACK.model.Usuario;
import com.store.BACK.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verifica se o usuário admin já existe no banco de dados (Alterado para email genérico)
        if (usuarioRepository.findByEmail("admin@admin.com").isEmpty()) {

            // Se não existir, cria um novo usuário admin genérico
            Usuario admin = new Usuario();
            admin.setNome("Administrador"); // Trocado de 'Admin Japa'
            admin.setEmail("admin@admin.com"); // Trocado de 'admin@japaunder.com'
            // Codifica a senha antes de salvar
            admin.setSenha(passwordEncoder.encode("123456")); // Senha padrão documentada
            admin.setRole("ROLE_ADMIN");

            // Cria dados dummy para evitar erro de NullPointer se o cadastro exigir
            admin.setCpf("000.000.000-00");
            admin.setTelefone("00000000000");

            usuarioRepository.save(admin);
            System.out.println(">>> Usuário ADMIN criado com sucesso!");
        }
    }
}