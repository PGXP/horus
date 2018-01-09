package pgxp.horus.dao;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import pgxp.horus.entity.Foto;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.core.MultivaluedMap;
import org.apache.commons.io.IOUtils;
import org.demoiselle.jee.crud.AbstractDAO;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import pgxp.horus.HorusConfig;

public class FotoDAO extends AbstractDAO< Foto, UUID> {

    @Inject
    private HorusConfig config;

    @PersistenceContext(unitName = "horusPU")
    protected EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public void salvarAnexo(MultipartFormDataInput input) {

        try {
            Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
            List<InputPart> inputParts = uploadForm.get("file");
            MultivaluedMap<String, String> header = inputParts.get(0).getHeaders();
            if (header.get("Content-Type").get(0).equalsIgnoreCase("application/pdf")) {
                String fileName = UUID.randomUUID().toString();
                InputStream inputStream = inputParts.get(0).getBody(InputStream.class, null);
                byte[] bytes = IOUtils.toByteArray(inputStream);
                Path file = Paths.get(config.getPath() + "imagens/");
                Files.createDirectories(file);
                file = Paths.get(config.getPath() + "imagens/" + fileName + ".png");
                Files.write(file, bytes);
            }
        } catch (IOException ex) {
            Logger.getLogger(FotoDAO.class.getName()).log(Level.SEVERE, null, ex);
        }

    }
}
