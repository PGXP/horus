package pgxp.horus.bc;

import pgxp.horus.entity.Foto;
import java.util.UUID;
import org.demoiselle.jee.crud.AbstractBusiness;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import pgxp.horus.dao.FotoDAO;

public class FotoBC extends AbstractBusiness< Foto, UUID> {

    public void salvarAnexo(MultipartFormDataInput input) {
        ((FotoDAO) dao).salvarAnexo(input);
    }

}
