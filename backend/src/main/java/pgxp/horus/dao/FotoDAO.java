package pgxp.horus.dao;

import java.util.List;
import java.util.Map;
import pgxp.horus.entity.Foto;
import java.util.UUID;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.demoiselle.jee.crud.AbstractDAO;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import pgxp.horus.service.ApplicationConfig;

public class FotoDAO extends AbstractDAO< Foto, UUID> {

    @Inject
    private ApplicationConfig config;

    @PersistenceContext(unitName = "horusPU")
    protected EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public void salvarAnexo(MultipartFormDataInput input) {

        Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
        List<InputPart> inputPartsAnexo = uploadForm.get("file");
        List<InputPart> inputPartsAnalise = uploadForm.get("foto");

        //System.out.println(inputPartsAnalise.get(0));
        System.out.println(inputPartsAnexo.get(0));

    }
}
